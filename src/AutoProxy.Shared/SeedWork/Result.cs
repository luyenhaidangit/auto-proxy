﻿using System.Text.Json.Serialization;

namespace AutoProxy.Shared.SeedWork
{
    public class Result
    {
        [JsonPropertyOrder(1)]
        public bool IsSuccess { get; set; }

        [JsonPropertyOrder(2)]
        public string Message { get; set; }

        [JsonPropertyOrder(3)]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Data { get; set; }

        [JsonPropertyOrder(4)]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? Errors { get; set; }

        public Result(bool isSuccess, string message, object? data = default, object? errors = default)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
            Errors = errors;
        }

        public static Result Success(object? data = default, string message = Constants.Message.Success)
        {
            return new Result(true, message, data);
        }

        public static Result Failure(object? errors = default, string message = Constants.Message.Failure)
        {
            return new Result(false, message, default, errors);
        }
    }
}
